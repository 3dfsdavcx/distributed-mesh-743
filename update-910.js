const EventEmitter = require('events');

class MeshNode extends EventEmitter {
  constructor(id) {
    super();
    this.id = id;
    this.connections = [];
    this.processedMessages = new Set();
  }

  connect(otherNode) {
    this.connections.push(otherNode);
    console.log(`Node ${this.id} linked to Node ${otherNode.id}`);
  }

  receive(message, originId) {
    if (this.processedMessages.has(message.id)) return;

    console.log(`Node ${this.id} received message: "${message.text}" from ${originId}`);
    this.processedMessages.add(message.id);

    // Relay to all neighbors except sender
    this.connections.forEach(neighbor => {
      if (neighbor.id !== originId) {
        neighbor.receive(message, this.id);
      }
    });
  }
}

// Example usage:
const node1 = new MeshNode('Alpha');
const node2 = new MeshNode('Beta');
const node3 = new MeshNode('Gamma');

node1.connect(node2);
node2.connect(node3);

const testMessage = { id: 'msg_001', text: 'Distributed Mesh Update 743' };
node1.receive(testMessage, 'external-source');